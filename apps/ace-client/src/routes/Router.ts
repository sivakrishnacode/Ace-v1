import Analytics from "@/pages/Analytics/Analytics";
import Dashboard from "@/pages/Dashboard/Dashboard";
import EventCreateMultiStep from "@/pages/Events/EventCreate/EventCreate";
import Events from "@/pages/Events/Events";
import EventsList from "@/pages/Events/EventsList";
import Home from "@/pages/Home";
import MainLayout from "@/pages/MainLayout";
import Payments from "@/pages/Payments/Payments";
import Team from "@/pages/Team/Team";
import Reports from "@/pages/Tools/Reports/Reports";
import Storage from "@/pages/Tools/Storage/Storage";
import Tutorial from "@/pages/Tools/Tutorial/Tutorial";
import { createBrowserRouter } from "react-router-dom";

async function authGuard() {
  return null;
}

export const router = createBrowserRouter([
  // --- Public Route (no layout) ---
  {
    path: "/",
    Component: Home,
    lazy: async () => {
      const module = await import("@/pages/Home");
      return { Component: module.default };
    },
  },

  // --- Auth Routes (with layout) ---
  {
    Component: MainLayout,
    loader: authGuard,
    children: [
      {
        path: "/dashboard",
        loader: authGuard,
        Component: Dashboard,
      },
      {
        path: "/events",
        loader: authGuard,
        Component: Events,
        children: [
          {
            index: true,
            Component: EventsList,
          },
          { path: "create", Component: EventCreateMultiStep },
        ],
      },
      {
        path: "/payments",
        loader: authGuard,
        Component: Payments,
      },
      {
        path: "/analytics",
        loader: authGuard,
        Component: Analytics,
      },
      { path: "/team", loader: authGuard, Component: Team },

      // Tools
      {
        path: "/tools/reports",
        loader: authGuard,
        Component: Reports,
      },
      {
        path: "/tools/storage",
        loader: authGuard,
        Component: Storage,
      },
      {
        path: "/tools/tutorial",
        loader: authGuard,
        Component: Tutorial,
      },
      {
        path: "/settings",
        loader: authGuard,
        Component: function Settings() {
          return "Settings Page";
        },
      },
    ],
  },
]);
