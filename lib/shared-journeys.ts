import { getSupabaseBrowserClient } from "./supabase";

export type CloudJourney = { id:string; code:string; state:Record<string, unknown>; userId:string };
export type CloudRating = { user_id:string; item_key:string; rating:"love"|"maybe"|"pass" };

async function authenticatedClient() {
  const client = getSupabaseBrowserClient();
  if (!client) throw new Error("Cloud saving is not configured yet.");
  let { data:{ user } } = await client.auth.getUser();
  if (!user) {
    const { data, error } = await client.auth.signInAnonymously();
    if (error) throw error;
    user = data.user;
  }
  if (!user) throw new Error("Could not start a private journey.");
  return { client, user };
}

export async function createCloudJourney(mode:string, state:Record<string, unknown>):Promise<CloudJourney> {
  const { client, user } = await authenticatedClient();
  const { data, error } = await client.rpc("create_namekind_journey", { p_mode:mode, p_state:state }).single();
  if (error) {
    console.error("[namekind/shared-journey] create failed", { code:error.code, message:error.message });
    throw error;
  }
  const row = data as {journey_id:string;journey_code:string;journey_state:Record<string,unknown>};
  return { id:row.journey_id, code:row.journey_code, state:row.journey_state, userId:user.id };
}

export async function joinCloudJourney(code:string):Promise<CloudJourney> {
  const { client, user } = await authenticatedClient();
  const { data, error } = await client.rpc("join_namekind_journey", { p_code:code.toUpperCase() }).single();
  if (error) throw error;
  const row = data as {journey_id:string;journey_code:string;journey_state:Record<string,unknown>};
  return { id:row.journey_id, code:row.journey_code, state:row.journey_state, userId:user.id };
}

export async function saveCloudJourney(id:string, state:Record<string, unknown>) {
  const { client } = await authenticatedClient();
  const { error } = await client.from("namekind_journeys").update({ state, updated_at:new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function saveCloudRating(id:string, itemKey:string, rating:string) {
  const { client, user } = await authenticatedClient();
  const { error } = await client.from("namekind_journey_ratings").upsert({ journey_id:id, user_id:user.id, item_key:itemKey, rating, updated_at:new Date().toISOString() });
  if (error) throw error;
}

export async function loadCloudRatings(id:string):Promise<CloudRating[]> {
  const { client } = await authenticatedClient();
  const { data, error } = await client.from("namekind_journey_ratings").select("user_id,item_key,rating").eq("journey_id", id);
  if (error) throw error;
  return (data || []) as CloudRating[];
}

export function subscribeToCloudJourney(id:string, onChange:()=>void) {
  const client = getSupabaseBrowserClient();
  if (!client) return () => undefined;
  const channel = client.channel(`namekind:${id}`)
    .on("postgres_changes", { event:"*", schema:"public", table:"namekind_journeys", filter:`id=eq.${id}` }, onChange)
    .on("postgres_changes", { event:"*", schema:"public", table:"namekind_journey_ratings", filter:`journey_id=eq.${id}` }, onChange)
    .subscribe();
  return () => { void client.removeChannel(channel); };
}
