import { Arg, Args, ArgsType, Field, Mutation, ObjectType, PubSub, PubSubEngine, Resolver, ResolverFilterData, Root, Subscription } from "type-graphql";
import { Ticket } from "../entities/Ticket";
import { User } from "../entities/User";
import { TicketStatusEnum } from "../enums/TicketStatusEnum";
import { TicketTypeEnum } from "../enums/TicketTypeEnum";
import { ServerError } from "../helpers/ServerError";
import { Subscriptions } from "../Subscription";
import { TicketValidator } from "../validators/TicketValidator";
import { ValidationError } from "../validators/ValidationError";

@ObjectType()
class TicketCreateResponse {
    @Field(() => Ticket, { nullable: true, defaultValue: null })
    ticket?: Ticket;
    @Field(() => [ServerError], { defaultValue: [] })
    errors?: ServerError[];
    @Field(() => [ValidationError], { defaultValue: [] })
    validation_errors?: ValidationError[];
}

@ObjectType()
class TicketUpdateResponse {
    @Field(() => Ticket, { nullable: true, defaultValue: null })
    ticket?: Ticket;
    @Field(() => [ServerError], { defaultValue: [] })
    errors?: ServerError[];
    @Field(() => [ValidationError], { defaultValue: [] })
    validation_errors?: ValidationError[];
}

@ArgsType()
@ObjectType()
class DefaultFilterArgs {
    @Field()
    id?: string;
}

@Resolver()
export class TicketResolver {

    @Mutation(() => TicketCreateResponse)
    async createTicket(
        @Arg('short_description') short_description: string,
        @Arg('description') description: string,
        @Arg('type') type: TicketTypeEnum,
        @Arg('responsible_user_id') responsible_user_id: string,
        @Arg('responsible_department_id') responsible_department_id: string,
        @Arg('issuer_id', { nullable: true, defaultValue: null }) issuer_id: string,
        @Arg('issuer_department_id') issuer_department_id: string,
        @Arg('service_id') service_id: string,
        @Arg('group_id', { nullable: true, defaultValue: null }) group_id: string,
        @PubSub() pubSub: PubSubEngine
    ): Promise<TicketCreateResponse> {
        // TODO: validation
        const errors = await TicketValidator.validate({
            short_description,
            description,
            type,
            status: null,
            responsible_user_id,
            responsible_department_id,
            issuer_id,
            issuer_department_id,
            service_id,
            group_id,
            owner_group_id: null
        });

        if (errors.length == 0) {
            const ticket = new Ticket(
                short_description,
                description,
                type,
                responsible_user_id,
                responsible_department_id,
                issuer_id,
                issuer_department_id,
                service_id,
                group_id
            );
            try {
                const res = await Ticket.insert(ticket);
                const insert_id = res.identifiers[0].id;
                const db_ticket = await Ticket.findOne({
                    where: {
                        id: insert_id
                    },
                    relations: [
                        "responsible_department",
                        "issuer_department",
                        "service",
                        "group",
                        "group.owner"
                    ]
                });
                db_ticket.responsible_user = await User.findOne(db_ticket.responsible_user_id);
                db_ticket.issuer = await User.findOne(db_ticket.issuer_id);
                await pubSub.publish(Subscriptions.CREATE_TICKET, db_ticket);
                return {
                    ticket: db_ticket
                }
            } catch (err) {
                console.log(err);
                return {
                    errors: [
                        {
                            name: "Server Error",
                            message: "Something at the servers side went wrong!"
                        }
                    ]
                }
            }
        }
        return {
            validation_errors: errors
        }
    }

    @Mutation(() => TicketUpdateResponse)
    async updateTicket(
        @Arg('id') id: string,
        @Arg('short_description', { nullable: true, defaultValue: null }) short_description: string,
        @Arg('description', { nullable: true, defaultValue: null }) description: string,
        @Arg('type', { nullable: true, defaultValue: null }) type: TicketTypeEnum,
        @Arg('status', { nullable: true, defaultValue: null }) status: TicketStatusEnum,
        @Arg('responsible_user_id', { nullable: true, defaultValue: null }) responsible_user_id: string,
        @Arg('responsible_department_id', { nullable: true, defaultValue: null }) responsible_department_id: string,
        @Arg('service_id', { nullable: true, defaultValue: null }) service_id: string,
        @Arg('group_id', { nullable: true, defaultValue: null }) group_id: string,
        @Arg('owner_group_id', { nullable: true, defaultValue: null }) owner_group_id: string,
        @PubSub() pubSub: PubSubEngine
    ): Promise<TicketUpdateResponse> {
        // TODO: validation
        const errors = await TicketValidator.validate({
            short_description,
            description,
            type,
            status,
            responsible_user_id,
            responsible_department_id,
            issuer_id: null,
            issuer_department_id: null,
            service_id,
            group_id,
            owner_group_id
        });

        if (errors.length == 0) {
            const ticket = await Ticket.findOne(id);
            ticket.short_description = short_description ?? ticket.short_description;
            ticket.description = description ?? ticket.description;
            ticket.type = type ?? ticket.type;
            ticket.status = status ?? ticket.status;
            ticket.responsible_user_id = responsible_user_id ?? ticket.responsible_user_id;
            ticket.responsible_department_id = responsible_department_id ?? ticket.responsible_department_id;
            ticket.service_id = service_id ?? ticket.service_id;
            ticket.group_id = group_id ?? ticket.group_id;
            ticket.owner_group_id = owner_group_id ?? ticket.owner_group_id;
            try {
                Ticket.update(id, ticket);
                const db_ticket = await Ticket.findOne({
                    where: {
                        id: id
                    },
                    relations: [
                        "responsible_department",
                        "issuer_department",
                        "service",
                        "group",
                        "group.owner"
                    ]
                });
                for (let i = 0; i < db_ticket.histories.length; i++) {
                    db_ticket.histories[i].responsible_user = await User.findOne(db_ticket.histories[i].responsible_user_id);
                }
                db_ticket.responsible_user = await User.findOne(db_ticket.responsible_user_id);
                db_ticket.issuer = await User.findOne(db_ticket.issuer_id);

                await pubSub.publish(Subscriptions.UPDATE_TICKET, db_ticket);
                return {
                    ticket: db_ticket
                }
            } catch (err) {
                console.log(err);
                return {
                    errors: [
                        {
                            name: "Server Error",
                            message: "Something at the servers side went wrong!"
                        }
                    ]
                }
            }
        }
        return {
            validation_errors: errors
        }
    }

    @Subscription(() => Ticket, {
        topics: Subscriptions.CREATE_TICKET
    })
    ticketCreated(
        @Root() ticketPayload: Ticket
    ): Ticket {
        return ticketPayload;
    }

    @Subscription({
        topics: Subscriptions.UPDATE_TICKET,
        filter: ({ payload, args }: ResolverFilterData<Ticket, DefaultFilterArgs>) => args.id == null || args.id == payload.id
    })
    ticketUpdated(
        @Root() ticketPayload: Ticket,
        @Args() id: DefaultFilterArgs
    ): Ticket {
        return ticketPayload;
    }
}