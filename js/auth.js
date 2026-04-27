import { supabase } from "./supabaseClient.js";

class AuthManager {
  constructor() {
    this.user = null;
    this.init();
  }

  async init() {
    const { data } = await supabase.auth.getSession();
    this.user = data.session?.user || null;
    
    supabase.auth.onAuthStateChange((_event, session) => {
      this.user = session?.user || null;
    });
  }

  async logout() {
    await supabase.auth.signOut();
    window.location.href = "../index.html";
  }

  isAuthenticated() {
    return !!this.user;
  }
}

window.auth = new AuthManager();