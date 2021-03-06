import { NonEmptyArray } from "type-graphql";
import { ApiKeyResolver } from "./ApiKeyResolver";
import { ApiScopeCategoryResolver } from "./ApiScopeCategoryResolver";
import { TicketResolver } from "./TicketResolver";
import { UserResolver } from "./UserResolver";

export const resolvers: NonEmptyArray<Function> = [
    UserResolver,
    TicketResolver,
    ApiKeyResolver,
    ApiScopeCategoryResolver,
];