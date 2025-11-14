import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agents-form";
import { AgentsGetOne } from "../../type";

interface UpdateAgentsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: AgentsGetOne,
}

const UpdateAgentDialog = ({ open, onOpenChange, initialValues }: UpdateAgentsDialogProps) => {
    return (
        <ResponsiveDialog
            title="Edit Agent"
            description="Edit the details of the agent"
            open={open}
            onOpenChange={onOpenChange}
        >
            <AgentForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}

export default UpdateAgentDialog;