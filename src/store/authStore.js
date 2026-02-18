import { defineStore } from "pinia";
import { ref } from "vue";
import { auth, db } from "@/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/models/User";

export const useAuthStore = defineStore("auth", () => {
    const profile = ref(null);

    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);

            profile.value = new User(firebaseUser, docSnap.data());
        } else {
            profile.value = null;
        }
    });

    return { profile };
})