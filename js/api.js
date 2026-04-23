import { supabase } from "./supabaseClient.js";

const API = {
  auth: {
    async signup({ email, password }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },

    async signin(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },

    async logout() {
      await supabase.auth.signOut();
    },
  },
};

window.API = API;