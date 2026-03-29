export type Login = {
  username: string;
  password: string;
};

export type Register = {
  username: string;
  password: string;
};

export type cred = {
  result: string
}

export type Profile = {
  id: string,
  username: string,
  avatar: string | undefined;
  mouseId: number,
  mousepadId: number,
  keyboardId: number,
};

export type Profiles = {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | undefined;
};

export type Peripheral = {
  id: number;
  name: string;
  url: string;
  type: string;
};