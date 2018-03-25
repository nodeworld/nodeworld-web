import { Map } from "immutable";

import * as VisitorActions from "../actions/visitor.actions";

import { addMessage, clearMessages } from "../actions/log.actions";
import { joinNode } from "../actions/node.actions";

import { WebVisitor } from "../models/visitor.model";
import { WebCommandContext, Command } from "../models/command.model";
import { MessageType } from "../models/message.model";

export interface CommandInfo {
    [key: string]: {
        name: string;
        help: string;
    }
}

export const Commands: CommandInfo = {
    ping: {
        name: "ping",
        help: "Test local command feedback."
    },
    info: {
        name: "info",
        help: "Retrieve your own information."
    },
    logout: {
        name: "logout",
        help: "Log out."
    },
    join: {
        name: "join",
        help: "Join a different node."
    }
}

export const parseCommand = (raw: string): Command => {
    const args = raw.split(" ");
    return {
        name: args[0].slice(1),
        raw,
        args: args.slice(1)
    };
}

export const runLocalCommand = async (ctx: WebCommandContext): Promise<boolean> => {
    const send = async (type: MessageType, content: string) => await ctx.dispatch(addMessage({ type, content } as any));

    switch(ctx.command.name) {
        case "help":
            const help_command = ctx.command.args[0];
            if(Commands.hasOwnProperty(help_command))
                await send(MessageType.SYSTEM, Commands[help_command].help);
            else
                await send(MessageType.SYSTEM, "Could not find information on that command. For a list of commands, type /commands");
            break;
        case "ping":
            await send(MessageType.SYSTEM, "Pong!");
            break;
        case "info":
            await send(MessageType.SYSTEM, `Your Visitor ID is ${ctx.visitor.id}`);
            await send(MessageType.SYSTEM, `Your name is ${ctx.visitor.name}`);
            await send(MessageType.SYSTEM, `Your email address is ${ctx.visitor.email}`);
            break;
        case "join":
            const node = ctx.command.args[0] || "";
            window.location.href = `/${node}`;
            await ctx.dispatch(joinNode(node));
            break;
        case "logout":
            await ctx.dispatch(VisitorActions.logOutVisitor());
            await send(MessageType.SYSTEM, "Logged out.");
            break;
        case "node":
            break;
        default:
            return false;
    }
    
    return true;
}