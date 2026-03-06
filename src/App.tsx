import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "@/pages/dashboard";
import SubjectsList from "@/pages/subjects/list";
import SubjectsCreate from "@/pages/subjects/create";
import DepartmentsList from "@/pages/departments/list";
import DepartmentsCreate from "@/pages/departments/create";
import UsersList from "@/pages/users/list";
import UsersCreate from "@/pages/users/create";
import ClassesCreate from "@/pages/classes/create";
import ClassesList from "@/pages/classes/list";
import ClassesShow from "@/pages/classes/show";
import {BookOpen, GraduationCap, Home, Landmark, Users} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "kgBoNb-QUtH4W-r52q2R",
              }}
              resources={[
                  {
                      name: "dashboard",
                      list: "/",
                      meta: {label: "Home", icon: <Home />}
                  },
                  {
                      name: "subjects",
                      list: "/subjects",
                      create: "/subjects/create",
                      meta: {label: "Subjects", icon: <BookOpen />}
                  },
                  {
                      name: "departments",
                      list: "/departments",
                      create: "/departments/create",
                      meta: {label: "Departments", icon: <Landmark />}
                  },
                  {
                      name: "users",
                      list: "/users",
                      create: "/users/create",
                      meta: {label: "Users", icon: <Users />}
                  },
                  {
                      name: "classes",
                      list: "/classes",
                      create: "/classes/create",
                      show: "/classes/show/:id",
                      meta: {label: "Classes", icon: <GraduationCap />}
                  }
              ]}
            >
              <Routes>
                  <Route element={
                      <Layout>

                          <Outlet />
                      </Layout>
                  }>
                      <Route path="/" element={<Dashboard/>} />
                         <Route path="subjects">
                         <Route index element={<SubjectsList/>} />
                             <Route path="create" element={<SubjectsCreate/>} />
                         </Route>

                         <Route path="departments">
                             <Route index element={<DepartmentsList/>} />
                             <Route path="create" element={<DepartmentsCreate/>} />
                         </Route>

                         <Route path="users">
                             <Route index element={<UsersList/>} />
                             <Route path="create" element={<UsersCreate/>} />
                         </Route>

                      <Route path="classes">
                          <Route index element={<ClassesList/>} />
                          <Route path="create" element={<ClassesCreate/>} />
                          <Route path="show/:id" element={<ClassesShow/>} />
                      </Route>
                  </Route>

              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
