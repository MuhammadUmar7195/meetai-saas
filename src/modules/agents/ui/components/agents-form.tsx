import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { useTRPC } from "@/trpc/client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { agentSchema } from "../../schema";
import { AgentRouterOutputs } from "../../type";
import { GenerateAvatar } from "@/components/generateAvatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentRouterOutputs
}

export const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions(),
                );

                if(initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    );
                }
                onSuccess?.();
            },
            onError: (error) => { 
                toast.error(`${error.message}`);

                // If Error code is Forbidden then we upgrade the plan in future.`
            }
        })
    )
    const form = useForm<z.infer<typeof agentSchema>>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
        }
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentSchema>) => {
        if (isEdit) {
            console.log("TODO: updateAgent");
        } else {
            createAgent.mutate(values);
        }
    }

    return (
        <>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <GenerateAvatar
                        seed={form.watch("name")}
                        className="w-12 h-12 rounded-full"
                        variant="botttsNeutral"
                    />
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. Math tutor" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="instructions"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="e.g. Provide detailed instructions" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between gap-x-2">
                        {onCancel &&
                            <>
                                <Button variant="ghost" onClick={onCancel} disabled={isPending} type="button" className="border">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                            </>
                        }
                    </div>
                </form>
            </Form>
        </>
    )
}
