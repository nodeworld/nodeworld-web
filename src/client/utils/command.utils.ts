import { Map } from "immutable";

import * as VisitorActions from "../actions/visitor.actions";

import { getVisitor, login } from "../api/visitor.api";

import { addMessage, clearMessages, setPrompt, setInputMode } from "../actions/log.actions";
import { joinNode } from "../actions/node.actions";

import { Visitor } from "../models/visitor.model";
import { WebCommandContext, Command } from "../models/command.model";
import { MessageType, buildMessage } from "../models/message.model";
import { NodeInputMode } from "../components/node/node-input";

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
    const send = async (type: MessageType, content: string) => await ctx.dispatch(addMessage(buildMessage({ type, content })));

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
            if(ctx.visitor) {
                await send(MessageType.SYSTEM, `Your Visitor ID is ${ctx.visitor.id}`);
                await send(MessageType.SYSTEM, `Your name is ${ctx.visitor.name}`);
                await send(MessageType.SYSTEM, `Your email address is ${ctx.visitor.email}`);
            } else {
                await send(MessageType.SYSTEM, "You must be logged in to use this command.");
            }
            break;
        case "join":
            const node = ctx.command.args[0] || "";
            window.location.href = `/${node}`;
            await ctx.dispatch(joinNode(node));
            break;
        case "login":
            const name = ctx.command.args[0];
            if(name) {
                try {
                    await send(MessageType.SYSTEM, `Logging in as ${name}...`);
                    const ctx_visitor = await getVisitor(name);
                    if(!ctx_visitor) throw "Visitor does not exist.";
                    await send(MessageType.SYSTEM, "Input visitor password:");
                    await ctx.dispatch(setInputMode(NodeInputMode.SECURE));
                    await ctx.dispatch(setPrompt("Input visitor password...", async (password: string) => {
                        try {
                            const visitor = await login({ name, password });
                            await ctx.dispatch(VisitorActions.setVisitor(visitor));
                            await ctx.dispatch(VisitorActions.setVisitorLogged(true));  // TODO: omit this whole thing
                        } catch(e) {
                            await send(MessageType.SYSTEM, `Error: ${e.errors.message}`);
                        } finally {
                            await ctx.dispatch(setInputMode(NodeInputMode.CHAT));
                        }
                    }));
                } catch(e) {
                    console.log(e);
                    await send(MessageType.SYSTEM, `Error: ${String(e)}`);
                }
            } else {
                await send(MessageType.SYSTEM, "A name must be specified in order to login.")
            }
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