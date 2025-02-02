import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../src/pages/Dashboard/DashboardPage";

describe("DashboardPage Filtering", () => {
  it("should initially display all organizations", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    waitFor(() => expect(screen.getByText(/Association for Computing Machinery/i))
      .toBeInTheDocument);
      waitFor(() => expect(screen.getByText(/DevelUP/i)).toBeInTheDocument);
      waitFor(() => expect(screen.getByText(/Google Developer Student Clubs/i))
      .toBeInTheDocument);
      waitFor(() => expect(screen.getByText(/UP Association of Computer Science Majors/i))
      .toBeInTheDocument);
      waitFor(() => expect(screen.getByText(/UP Center for Student Innovations/i))
      .toBeInTheDocument);
  });
  it("should filter organizations by search query", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText("Type to Search");

    userEvent.type(searchInput, "Computer");

    waitFor(() => expect(screen.getByText(/Association for Computing Machinery/i)).not
      .toBeInTheDocument);
      waitFor(() => expect(screen.getByText(/UP Association of Computer Science Majors/i))
      .toBeInTheDocument);
  });

  it("should filter starred orgs", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    const starredButton = screen.getByText("Starred");

    userEvent.click(starredButton);

    waitFor(() => expect(screen.getByText(/Association for Computing Machinery/i)).not.toBeInTheDocument);
    waitFor(() => expect(screen.getByText(/DevelUP/i)).not.toBeInTheDocument);
    waitFor(() => expect(screen.getByText(/Google Developer Student Clubs/i)).not.toBeInTheDocument);
    waitFor(() => expect(screen.getByText(/UP Association of Computer Science Majors/i)).not.toBeInTheDocument);
    waitFor(() => expect(screen.getByText(/UP Center for Student Innovations/i)).not.toBeInTheDocument);
  });
});
