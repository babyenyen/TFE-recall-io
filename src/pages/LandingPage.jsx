import OnboardingCarousel from "@/components/OnboardingCarousel";
import AuthBox from "@/components/AuthBox";
import LogoFull from "@/components/common/LogoFull";

export default function LandingPage() {
    return (
        <div className="flex flex-col md:flex-row items-center h-screen w-screen overflow-y-hidden">
            <div className="md:w-2/5 text-center mb-10 mx-10">
                <div className="flex justify-center m-10">
                    <LogoFull className="md:w-32 w-24 h-auto fill-violet-600" />
                </div>
                <AuthBox />
            </div>
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <OnboardingCarousel />
            </div>
        </div>
    );
}

