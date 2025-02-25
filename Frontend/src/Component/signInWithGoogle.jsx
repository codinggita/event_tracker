import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";  

// Changed to export the login function separately so it can be used in Login.jsx
export async function googleLogin(isRegistration = false) {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const userDoc = await getDoc(doc(db, "Users", user.uid));

      // If this is for registration, we should create a new user
      if (isRegistration) {
        // For registration, we don't need to check if user exists
        return user; // Return the user so Register component can handle the rest
      } else {
        // For login, we need to check if user exists
        if (userDoc.exists()) {
          toast.success("User logged in Successfully", {
            position: "top-center",
          });
          window.location.href = "/profile";
          return user;
        } else {
          // User doesn't exist, log them out
          await signOut(auth);
          toast.error("You need to sign up first!", { position: "top-center" });
          return null;
        }
      }
    }
  } catch (error) {
    toast.error("Google Sign-In Failed", { position: "top-center" });
    return null;
  }
}

function SignInwithGoogle({ isRegistration = false }) {
  const handleClick = () => {
    googleLogin(isRegistration);
  };

  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={handleClick}
      >
        <img src="https://github.com/the-debug-arena/Login-Auth-Firebase-ReactJS/blob/main/src/google.png?raw=true" width={"60%"} />
      </div>
    </div>
  );
}

export default SignInwithGoogle;