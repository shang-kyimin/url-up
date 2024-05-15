import PocketBase from "pocketbase";


const APP_URL = import.meta.env.VITE_POCKETBASE_SERVER_URL;


export const client = new PocketBase(APP_URL)
  .autoCancellation(false);


export const isUserValid = client.authStore.isValid;

export async function login(data) {
  await client.collection("users").authWithPassword(data.email, data.password);
}

export function signout() {
  client.authStore.clear();
  window.location.reload();
}

export async function signup(data) {
  try {
    await client.collection("users").create(data);
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function getLinks() {
  return await client.collection("links").getFullList();
}

export async function getLink(id) {
  return await client.collection("links").getOne(id);
}

export async function createLink(link) {
  await client.collection("links").create({ ...link, user: client.authStore.model.id });
}

export async function editLink(id, data) {
  const confirm = window.confirm("Are you sure you want to update this link?");
  if (!confirm) throw new Error("Cancel edit");
  
  await client.collection("links").update(id, { ...data, user: client.authStore.model.id });
}

export async function editVisitedOrNot(data) {
  await client.collection("links").update(data.id, { ...data, user: client.authStore.model.id });
}

export async function deleteLink(id) {
  const confirm = window.confirm("Are you sure you want to delete this link?");
  if (!confirm) throw new Error("Cancel delete");

  await client.collection("links").delete(id);
}


