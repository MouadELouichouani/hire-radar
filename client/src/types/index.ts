export type User = {
  id: string;
  full_name: string;
  email: string;
  role: "candidate" | "employer";
  image?: string;
};
