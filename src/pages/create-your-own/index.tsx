

import { ReactElement } from "react";
import { CreateYourOwnDesigner } from "@/shared/features/page/CustomYourOwn";
import { PrimaryLayout } from "@/layouts";

const CreateYourOwnPage = () => {
    return (
        <div className="w-full h-screen bg-gray-50">
            <CreateYourOwnDesigner />
        </div>
    );
};


CreateYourOwnPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <PrimaryLayout seo={{ title: 'Create Your Own', canonical: "/create-your-own" }}>
            {page}
        </PrimaryLayout>
    );
};

export default CreateYourOwnPage;