import React, { useState, useEffect } from "react";
import {
  TbBrandDribbble,
  TbBrandFacebook,
  TbBrandYoutube,
  TbBell,        // 🔔 Active Reminders
  TbBuilding,    // 🏢 Departments
  TbUsers,       // 👥 Users
} from "react-icons/tb";
import CardBox from "@/app/components/shared/CardBox";
import Image from "next/image";
import Banner from "/public/images/backgrounds/profilebg.jpg";
import Link from "next/link";
import { Button } from "flowbite-react";
import ProfileTab from "./ProfileTab";
import { reminderService, departmentService, userService } from "@/app/services/api";

const ProfileBanner = () => {
    const [activeReminderCount, setActiveReminderCount] = useState<number>(0);
    const [totalDepartmentsCount, setTotalDepartmentsCount] = useState<number>(0);
    const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Active Reminders
                const reminders = await reminderService.getReminders();
                const activeReminders = reminders.filter(reminder => reminder.active);
                setActiveReminderCount(activeReminders.length);

                // Fetch Total Departments
                const departments = await departmentService.getDepartments();
                setTotalDepartmentsCount(departments.length);

                // Fetch Total Users
                const users = await userService.getAllUsers();
                setTotalUsersCount(users.length);

                setError(null);
            } catch (err) {
                console.error("Error fetching data for ProfileBanner:", err);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) return <div>{error}</div>;
    // if (loading) return <div>Loading profile stats...</div>; // Keep loading indicator for a better UX, but omit for now as per previous instructions

  return (
    <>
      <CardBox className="p-0 overflow-hidden">
        <Image
          src={Banner}
          alt="profile banner"
          className="w-full"
          height={330}
        />
        <div className="bg-white dark:bg-dark p-6 -mt-2">
          <div className="grid grid-cols-12 gap-3">
            {/* --- Stats Section --- */}
            <div className="lg:col-span-4 col-span-12 lg:order-1 order-2">
              <div className="flex gap-6 items-center justify-around lg:py-0 py-4">
                <div className="text-center">
                  <TbBell
                    className="block mx-auto text-ld opacity-50 "
                    size="20"
                  />
                  <h4 className="text-xl">{loading ? '...' : activeReminderCount}</h4>
                  <p className="text-darklink text-sm">Active Reminders</p>
                </div>
                <div className="text-center">
                  <TbBuilding
                    className="block mx-auto text-ld opacity-50"
                    size="20"
                  />
                  <h4 className="text-xl">{loading ? '...' : totalDepartmentsCount}</h4>
                  <p className="text-darklink text-sm">Total Departments</p>
                </div>
                <div className="text-center">
                  <TbUsers
                    className="block mx-auto text-ld opacity-50"
                    size="20"
                  />
                  <h4 className="text-xl">{loading ? '...' : totalUsersCount}</h4>
                  <p className="text-darklink text-sm">Total Users</p>
                </div>
              </div>
            </div>
            {/* --- Profile Picture Section --- */}
            <div className="lg:col-span-4 col-span-12 lg:order-2 order-1">
              <div className="text-center -mt-20 ">
                <div className="w-[110px] h-[110px] linear-gradient rounded-full flex justify-center items-center mx-auto">
                  <Image
                    src="/images/profile/user-1.jpg"
                    alt="profile"
                    height="100"
                    width="100"
                    className="rounded-full mx-auto border-4 border-white dark:border-darkborder"
                  />
                </div>
                <h5 className="text-lg mt-3">Jonathan Deo</h5>
                <p className="text-darklink">Designer</p>
              </div>
            </div>
            {/* --- Social Section --- */}
            <div className="lg:col-span-4 col-span-12 lg:order-3 order-3">
              <div className="flex items-center gap-3.5 lg:justify-end justify-center h-full xl:pe-4">
                {/* <Button
                  as={Link}
                  href={""}
                  className="h-9 w-9 rounded-full p-0"
                  color={"primary"}
                >
                  <TbBrandFacebook size={20} />
                </Button>
                <Button
                  as={Link}
                  href={""}
                  className="h-9 w-9 rounded-full p-0"
                  color={"secondary"}
                >
                  <TbBrandDribbble size={20} />
                </Button>
                <Button
                  as={Link}
                  href={""}
                  className="h-9 w-9 rounded-full p-0"
                  color={"error"}
                >
                  <TbBrandYoutube size={20} />
                </Button> */}
              <Link href="/apps/invoice/list">
  <Button color="primary" className="rounded-md">
    Reminder List
  </Button>
</Link>

               
              </div>
            </div>
          </div>
        </div>
        {/* Profile Tabs */}
        <ProfileTab />
      </CardBox>
    </>
  );
};

export default ProfileBanner;
