export type Member = {
  userid: string,
  username: string,
  email?: string,
  phone?: string,
  preferred_contact_mode?: 'phone' | 'email' | 'both',
}