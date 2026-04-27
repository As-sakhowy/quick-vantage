import { supabase } from "./supabaseClient.js";

const API = {
  auth: {
    async signup({ email, password }) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { user: data.user, token: data.session?.access_token };
    },
    async signin(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { user: data.user, token: data.session?.access_token };
    },
    async logout() {
      await supabase.auth.signOut();
    },
    async getUser() {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  },
  properties: {
    async fetchAll() {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  }
};

window.API = API;
export { API };