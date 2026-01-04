export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  Splash: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  TaskList: undefined;
  TaskDetail: { taskId: number };
  CreateTask: undefined;
  EditTask: { taskId: number };
  Profile: undefined;
  Garden: undefined;
};

export type BottomTabParamList = {
  Garden: undefined;
  Tasks: undefined;
  Profile: undefined;
};
