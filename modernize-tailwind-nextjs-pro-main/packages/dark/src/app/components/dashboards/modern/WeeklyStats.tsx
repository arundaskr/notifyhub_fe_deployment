"use client"
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import CardBox from "../../shared/CardBox"
import { Badge } from "flowbite-react";
import { useState, useEffect } from "react";
import { reminderService } from "@/app/services/api";
import { Reminder } from "@/types/apps/invoice";
import { isToday, isThisWeek, isPast, parseISO } from "date-fns";


export const WeeklyStats = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                setLoading(true);
                const fetchedReminders = await reminderService.getReminders();
                setReminders(fetchedReminders);
                setError(null);
            } catch (err) {
                setError("Failed to load reminders");
            } finally {
                setLoading(false);
            }
        };

        fetchReminders();
    }, []);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Loading reminders...</div>;

    const todayReminders = reminders.filter(reminder => 
        reminder.reminderStartDate && isToday(parseISO(reminder.reminderStartDate))
    );

    const weeklyReminders = reminders.filter(reminder => 
        reminder.reminderStartDate && isThisWeek(parseISO(reminder.reminderStartDate))
    );

    const activeReminders = reminders.filter(reminder => reminder.active);
    
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
    const SalesData = [
        {
            key:"topSales",
            title:"Active Reminders",
            subtitle: activeReminders.length > 0 ? activeReminders[0].description || "No active reminders" : "No active reminders",
            badgeColor:"lightprimary",
            bgcolor:"bg-lightprimary text-primary",
            count: activeReminders.length
        },
        {
            key:"topSeller",
            title:"Weekly Reminders",
            subtitle: weeklyReminders.length > 0 ? weeklyReminders[0].description || "No weekly reminders" : "No weekly reminders",
            badgeColor:"lightsuccess",
            bgcolor:"bg-lightsuccess text-success",
            count: weeklyReminders.length
        },
        {
            key:"topCommented",
            title:"Todays Reminders",
            subtitle: todayReminders.length > 0 ? todayReminders[0].description || "No reminders today" : "No reminders today",
            badgeColor:"lighterror",
            bgcolor:"bg-lighterror text-error",
            count: todayReminders.length
        }
    ]
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

            {SalesData.map((item)=>{
                return(
                    <div key={item.key} className="flex items-center justify-between mb-7 last:mb-0">
                    <div className="flex items-center gap-3">
                        <div className={`${item.bgcolor} h-10 w-10 flex justify-center items-center rounded-md`}>
                            <Icon icon="tabler:grid-dots" className=' text-xl' />
                        </div>
                        <div>
                            <h6 className="text-base">{item.title}</h6>
                            <p className=" dark:text-darklink ">{item.subtitle}</p>
                        </div>
                    </div>
                    <Badge color={`${item.badgeColor}`} className="py-1.1 rounded-md text-sm" >{item.count}</Badge>
                </div>
                )
            })}
        </CardBox>


    )
}