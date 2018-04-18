import { Map } from "immutable";

import * as VisitorActions from "../actions/visitor.actions";

import { getVisitor, login, register } from "../api/visitor.api";

import { printMessage, clearMessages, setPrompt, setInputMode } from "../actions/log.actions";
import { joinNode, leaveNode, showVisitorsList } from "../actions/node.actions";

import { Visitor } from "../models/visitor.model";
import { WebCommandContext, Command } from "../models/command.model";
import { MessageType } from "../models/message.model";
import { NodeInputMode } from "../components/node/node-input";

export interface CommandInfo {
    [key: string]: {
        name: string;
        usage: string;
        help: string;
    }
}

export const Commands: CommandInfo = {
    help: {
        name: "help",
        usage: "/help ?[command name]",
        help: "Show a list of commands, and see detailed information on a specific command."
    },
    ping: {
        name: "ping",
        usage: "/ping",
        help: "Test local command feedback."
    },
    info: {
        name: "info",
        usage: "/info",
        help: "Retrieve your own information."
    },
    logout: {
        name: "logout",
        usage: "/logout",
        help: "Log out."
    },
    join: {
        name: "join",
        usage: "/join [node name]",
        help: "Join a different node."
    },
    leave: {
        name: "leave",
        usage: "/leave",
        help: "Leave the current node you are in."
    },
    register: {
        name: "register",
        usage: "/register [new visitor name]",
        help: "Register a new visitor (account) in Nodeworld."
    },
    login: {
        name: "login",
        usage: "/login [visitor name]",
        help: "Login to a visitor (account) in Nodeworld."
    },
    node: {
        name: "node",
        usage: "/node",
        help: "See detailed information about the node you are in."
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
    const send = async (type: MessageType, content: string) => await ctx.dispatch(printMessage({ type, content }));
    const visitor_state = ctx.getState().visitor;
    const node_state = ctx.getState().node;

    try {
        switch(ctx.command.name) {
            case "help": {
                const help_command = ctx.command.args[0];
                if(!help_command) {
                    await send(MessageType.SYSTEM, `Here are a list of local commands you can use: ${Object.keys(Commands).sort().join(", ")}`);
                    await send(MessageType.SYSTEM, "For more information on a command, type /help [command name]");
                } else {
                    if(!Commands.hasOwnProperty(help_command)) throw new Error("Could not find information on that command. Type /help for a list of commands");
                    const cmd = Commands[help_command];
                    await send(MessageType.SYSTEM, `"${cmd.name}" command. Usage: ${cmd.usage}`);
                    await send(MessageType.SYSTEM, cmd.help);
                }
                break;
            }
            case "ping": {
                await send(MessageType.SYSTEM, "Pong!");
                break;
            }
            case "info": {
                if(!visitor_state.visitor) throw new Error("You must be logged in to use this command.");
                await send(MessageType.SYSTEM, `Your Visitor ID is ${visitor_state.visitor.id}`);
                await send(MessageType.SYSTEM, `Your name is ${visitor_state.visitor.name}`);
                await send(MessageType.SYSTEM, `Your email address is ${visitor_state.visitor.email}`);
                break;
            }
            case "join": {
                const ctx_node = ctx.command.args[0];
                if(!ctx_node) throw new Error("A node name must be specified in order to join.");
                if(node_state.node && node_state.node.name === ctx_node) throw new Error("You are already in that node. Type /leave to leave this node.");
                await ctx.dispatch(joinNode(ctx_node));
                history.pushState(null, ctx_node, `${location.origin}/${ctx_node}`);
                break;
            }
            case "leave": {
                await ctx.dispatch(leaveNode());
                history.pushState(null, "", location.origin);
                break;
            }
            case "login": {
                const name = ctx.command.args[0];
                if(!name) throw new Error("A name must be specified in order to login.");
                if(visitor_state.visitor) throw new Error("You are already logged in.");
                const ctx_visitor = await getVisitor(name);
                if(!ctx_visitor) throw new Error("Visitor does not exist.");
                await send(MessageType.SYSTEM, "Input visitor password:");
                await ctx.dispatch(setInputMode(NodeInputMode.SECURE));
                await ctx.dispatch(setPrompt("Input visitor password...", async (password: string) => {
                    try {
                        const visitor = await login({ name, password });
                        await ctx.dispatch(VisitorActions.setVisitor(visitor));
                        await send(MessageType.SYSTEM, "Logged in.");
                    } catch(e) {
                        await send(MessageType.SYSTEM, `Error: ${e.message}`);
                    } finally {
                        await ctx.dispatch(setInputMode(NodeInputMode.CHAT));
                    }
                }));
                break;
            }
            case "register": {
                const name = ctx.command.args[0];
                if(!name) throw new Error("A name must be specified in order to create a visitor.");
                if(visitor_state.visitor) throw new Error("You are already logged in.");
                const ctx_visitor = await getVisitor(name);
                if(ctx_visitor) throw new Error("Visitor already exists.");
                await send(MessageType.SYSTEM, "Input new visitor password:");
                await ctx.dispatch(setInputMode(NodeInputMode.SECURE));
                await ctx.dispatch(setPrompt("Input new visitor password...", async (password: string) => {
                    try {
                        await register({ name, password });
                        const visitor = await login({ name, password });
                        await ctx.dispatch(VisitorActions.setVisitor(visitor));
                        await send(MessageType.SYSTEM, "Created new visitor.");
                    } catch(e) {
                        await send(MessageType.SYSTEM, `Error: ${e.message}`);
                    } finally {
                        await ctx.dispatch(setInputMode(NodeInputMode.CHAT));
                    }
                }));
                break;
            }
            case "logout": {
                if(!visitor_state.visitor) throw new Error("You are not logged in.");
                await ctx.dispatch(VisitorActions.logOutVisitor());
                await send(MessageType.SYSTEM, "Logged out.");
                break;
            }
            case "node": {
                break;
            }
            case "visitors": {
                await ctx.dispatch(showVisitorsList());
                break;
            }
            default: {
                return false;
            }
        }
        
        return true;
    } catch(e) {
        await send(MessageType.SYSTEM, `Error: ${e.message}`);
        return true;
    }
}