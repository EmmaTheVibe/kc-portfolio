"use client";

import { projects } from "@/content/projects";
import { NavScreen, NavStack } from "../../phone/NavStack";
import { FeaturedCard, ProjectRow } from "./StoreDesktop";
import { StoreListing } from "./StoreListing";

type Route = { name: "list" } | { name: "project"; id: string };

export function StorePhone() {
  return (
    <NavStack<Route>
      root={{ name: "list" }}
      renderScreen={(route, nav) => {
        const project = route.name === "project" ? projects.find((p) => p.id === route.id) : undefined;
        if (project) {
          return (
            <NavScreen title={project.name} backLabel="Projects" plain>
              <div className="@container px-4 pt-2">
                <StoreListing project={project} />
              </div>
            </NavScreen>
          );
        }
        return (
          <NavScreen title="Projects" largeTitle plain>
            <div className="px-4">
              <FeaturedCard project={projects[0]} onOpen={() => nav.push({ name: "project", id: projects[0].id })} />
              <h2 className="mt-6 text-[22px] font-bold">All Projects</h2>
              {projects.map((p) => (
                <ProjectRow key={p.id} project={p} onOpen={() => nav.push({ name: "project", id: p.id })} />
              ))}
            </div>
          </NavScreen>
        );
      }}
    />
  );
}
