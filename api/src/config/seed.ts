import User from "../features/auth/models/User";

export const initialUsers = async () => {
  // prathik
  if (!(await User.exists({ username: "prathik" }).exec())) {
    const user = new User({ name: "Prathik", username: "prathik" });
    const password = "meghnalover";
    User.register(user, password);
  }

  // meghna
  if (!(await User.exists({ username: "meghna" }).exec())) {
    const user = new User({ name: "Meghna", username: "meghna" });
    const password = "prathiklover";
    User.register(user, password);
  }
};
