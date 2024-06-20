import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";


const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();

    const navigate = useNavigate();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async() => {
            showToast({message: "Signed out!", type: "SUCCESS"});
            await queryClient.invalidateQueries("validateToken")
            navigate("/sign-in");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    })

    const handleSignOut = () => {
        mutation.mutate();
    }

    return (
        <button 
            className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
            onClick={ handleSignOut }>
            Sign out 
        </button>
    )
}

export default SignOutButton;