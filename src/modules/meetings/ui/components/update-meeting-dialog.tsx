import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingGetOne } from "../../type";
import { MeetingForm } from "./meeting-form";

interface UpdateMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne,
}

const UpdateMeetingDialog = ({ open, onOpenChange, initialValues }: UpdateMeetingDialogProps) => {
    return (
        <ResponsiveDialog
            title="Edit Meeting"
            description="Edit the details of the meeting"
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}

export default UpdateMeetingDialog;