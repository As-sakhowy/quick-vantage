import { supabase } from "./supabaseClient.js";

class AuthManager {
  constructor() {
    this.user = null;
    this.session = null;
    this.init();
  }

  async init() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      this.user = data.session.user;
      this.session = data.session;
    }

    supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null;
      this.session = session || null;
    });
  }

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return data;
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  }

  async logout() {
    await supabase.auth.signOut();
    window.location.href = "./index.html";
  }

  isAuthenticated() {
    return !!this.user;
  }
}

window.auth = new AuthManager();