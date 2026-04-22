import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
type NavProps = {
    currentStepIndex: number;
};
const steps = ["Cart", "Order Information", "Complete"];
const BreadcrumbComponent = ({ currentStepIndex }: NavProps) => {
    console.log(currentStepIndex)
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {steps.map((step, index) => (
                    <>
                        <BreadcrumbItem key={index} className={`cursor-pointer text-md ${currentStepIndex >= index ? 'font-medium text-orange-600' : ''}`}>
                            <div>
                                {step}
                            </div>
                        </BreadcrumbItem>
                        {index < steps.length - 1 && <BreadcrumbSeparator className={`cursor-pointer text-md ${currentStepIndex >= index ? 'font-medium text-orange-600' : ''}`} />}
                    </>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadcrumbComponent;