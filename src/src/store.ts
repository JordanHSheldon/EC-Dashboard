import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Profile } from "./lib/definitions";

export interface UserStore {
  IsLoggedIn: boolean;
  profile: Profile | undefined;
  loading: boolean;
  error: string | undefined;
  initializeAuth: () => void;
  logout: () => void;
  getProfile: () => void;
  updateProfile: () => void;
}

export const useUserStore = create(
    devtools<UserStore>((set,get) => ({
      IsLoggedIn: false,
      profile: undefined,
      loading: false,
      error: undefined,
      initializeAuth: async() => {
        set({ loading: true, error: undefined });
        try {
          const user_response = await fetch(import.meta.env.VITE_API_URL+'api/User/IsLoggedIn', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if(!user_response.ok){
             set({
              loading: false,
              IsLoggedIn: false
            });
            return;
          }

          const data: any = await user_response.json();
          
          set({
            loading: false,
            IsLoggedIn: data.isLoggedIn
          });

          get().getProfile();
        } catch (error) {
          set({
            loading: false,
            IsLoggedIn: false,
            profile: undefined
          });
        }
      },
      logout: async() => {
        set({ loading: true, error: undefined });
        try {
          const user_response = await fetch(import.meta.env.VITE_API_URL+'api/User/Logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if(!user_response.ok){
            console.error('response was not okay')
            return;
          }

          set({
            profile: undefined,
            loading: false,
            IsLoggedIn: false
          });
        } catch (error) {
          set({
            loading: false,
            IsLoggedIn:false,
          });
        }
      },
      getProfile: async () => {
        if(get().IsLoggedIn !== true) return;
        set({ loading: true, error: undefined });
        try {
          const user_response = await fetch(import.meta.env.VITE_API_URL+'api/Profile/GetProfile', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if(!user_response.ok){
            console.error('response was not okay')
            return;
          }
      
          const data: Profile = await user_response.json();

          set({
            profile: data,
            loading: false,
          });
        } catch (error) {
            console.log(error)
          set({
            loading: false,
          });
        }
      },
      updateProfile: async () => {
        set({ loading: true, error: undefined });
        try {
          const state = useUserStore.getState();
          if(!state.profile){
            return;
          }

          const user_response = await fetch(import.meta.env.VITE_API_URL+'api/Profile/UpdateProfile', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(state.profile)
          });

          if(!user_response.ok){
            console.error('response was not okay')
            set({
              error:user_response?.body?.toString()
            })
            return;
          }

          set({
            loading: false,
          });

        } catch (error) {
          console.log(error)
          set({
            loading: false,
            error: "An Error occured"
          });
        }
      },
  }))
); 