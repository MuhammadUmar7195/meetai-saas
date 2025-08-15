import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agents-form";

interface NewAgentsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NewAgentsDialog = ({ open, onOpenChange }: NewAgentsDialogProps) => {
    return (
        <ResponsiveDialog
            title="New Agent"
            description="Create a new agent"
            open={open}
            onOpenChange={onOpenChange}
        >
            <AgentForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}

export default NewAgentsDialog;