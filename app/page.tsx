"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [token, setToken] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("tempoToken");
    const savedWorkerId = localStorage.getItem("workerId");
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedWorkerId) {
      setWorkerId(savedWorkerId);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("tempoToken", token);
    }
  }, [token]);

  useEffect(() => {
    if (workerId) {
      localStorage.setItem("workerId", workerId);
    }
  }, [workerId]);

  const originTaskId = "2401307";
  const timeZone = "America/Sao_Paulo";

  const getWeekdaysInRange = (start: string, end: string) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      if (current.getDay() > 0 && current.getDay() < 6) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const registerHours = async () => {
    if (!token || !workerId || !startDate || !endDate) {
      alert("Preencha todos os campos.");
      return;
    }

    const days = getWeekdaysInRange(startDate, endDate);
    for (const day of days) {
      const body = {
        attributes: {},
        billableSeconds: 28800,
        workerId,
        comment: "teste",
        started: `${day.toISOString().split("T")[0]}T08:00:00.000`,
        timeSpentSeconds: 28800,
        originTaskId,
        userTimeZone: timeZone,
      };

      try {
        const response = await fetch("https://app.tempo.io/rest/tempo-timesheets/4/worklogs", {
          method: "POST",
          headers: {
           "Authorization": `${token}`,
           "Content-Type": "application/json",
           "Accept": "application/json", 
           "Origin": window.location.origin,
           "Referer": window.location.origin,
           "Host": "app.tempo.io",
           "Postman-Token": "your-postman-token", // Replace with actual Postman token if needed
           "Content-Length": JSON.stringify(body).length.toString(),
          },
          body: JSON.stringify(body),
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Erro ao registrar hora:", error);
      }
    }
    alert("Horas registradas com sucesso!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-black">
        <h1 className="text-2xl font-bold text-center mb-6">Registrar Horas - Jira</h1>

        <label className="block mb-2">
          Token Tempo-Bearer:
          <input
            type="text"
            placeholder="Tempo-Bearer {token}"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 text-black"
          />
        </label>

        <label className="block mb-2">
          Worker ID:
          <input
            type="text"
            placeholder="Worker ID"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 text-black"
          />
        </label>

        <label className="block mb-2">
          Data inicial:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 text-black"
          />
        </label>

        <label className="block mb-4">
          Data final:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
          />
        </label>

        <button
          onClick={registerHours}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Registrar
        </button>
      </div>
    </div>
  );
}