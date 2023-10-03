import PocketBase from 'pocketbase';

const url = 'https://nutrielite.pockethost.io';
export const client = new PocketBase(url);
client.autoCancellation(false);