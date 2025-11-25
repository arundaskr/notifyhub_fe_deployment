"use client";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import CardBox from "../../shared/CardBox";
import { Badge } from "flowbite-react";
import React, { useContext } from "react";
import { UserDataContext } from "@/app/context/UserDataContext/index";
import { isToday, isWithinInterval, addDays, startOfDay } from "date-fns";

export const WeeklyStats = () => {
  const { reminders } = useContext(UserDataContext);

  const ChartData: any = {
    series: [
      {
        name: "Weekly Stats",
        color: "var(--color-primary)",
        data: [5, 15, 10, 20],
      },
    ],
    chart: {
      id: "sparkline3",
      type: "area",
      height: 180,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.1,
        opacityTo: 0,
        stops: [20, 280],
      },
    },

    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };

  const today = startOfDay(new Date());
  const nextSevenDays = addDays(today, 7);

  const activeReminders = reminders
    ? reminders.filter((r) => r.active).length
    : 0;
  const weeklyReminders = reminders
    ? reminders.filter((r) =>
        isWithinInterval(new Date(r.reminderEndDate), {
          start: today,
          end: nextSevenDays,
        })
      ).length
    : 0;
  const todaysReminders = reminders
    ? reminders.filter((r) => isToday(new Date(r.reminderEndDate))).length
    : 0;

  const SalesData = [
    {
      key: "topSales",
      title: "Active Reminders",
      subtitle: "Submit timesheet",
      count: activeReminders,
      badgeColor: "lightprimary",
      bgcolor: "bg-lightprimary text-primary",
    },
    {
      key: "topSeller",
      title: "Weekly Reminders",
      subtitle: "Fix login issue",
      count: weeklyReminders,
      badgeColor: "lightsuccess",
      bgcolor: "bg-lightsuccess text-success",
    },
    {
      key: "topCommented",
      title: "Todays Reminders",
      subtitle: "Client meeting preparation",
      count: todaysReminders,
      badgeColor: "lighterror",
      bgcolor: "bg-lighterror text-error",
    },
  ];

  return (
    <CardBox>
      <h5 className="card-title">Reminder Stats</h5>
      <p className="card-subtitle">Upcoming tasks this week</p>
      <div className="my-6">
        <Chart
          options={ChartData}
          series={ChartData.series}
          type="area"
          height="170px"
          width={"100%"}
        />
      </div>

      {SalesData.map((item) => {
        return (
          <div
            key={item.key}
            className="flex items-center justify-between mb-7 last:mb-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`${item.bgcolor} h-10 w-10 flex justify-center items-center rounded-md`}
              >
                <Icon icon="tabler:grid-dots" className=" text-xl" />
              </div>
              <div>
                <h6 className="text-base">{item.title}</h6>
                <p className=" dark:text-darklink ">{item.subtitle}</p>
              </div>
            </div>
            <Badge
              color={`${item.badgeColor}`}
              className="py-1.1 rounded-md text-sm"
            >
              {item.count}
            </Badge>
          </div>
        );
      })}
    </CardBox>
  );
};