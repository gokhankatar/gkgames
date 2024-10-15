import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = getAuth();
  const router = useRouter();

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/')
      }
      resolve();
    });
  });
});