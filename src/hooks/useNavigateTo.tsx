import { useRouter } from "@tanstack/react-router";

export const useNavigateTo = () => {
    const router = useRouter();

    const navigateTo = (path: string) => {
        router.navigate({
            to: path
        })
    }

    return {
        navigateTo
    }
}