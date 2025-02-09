"use client";

import React from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useSession, updateSession } from "next-auth/react";

import EditIcon from "@mui/icons-material/Edit";

//update the other parts later (the ones besides stats)
export default function Profile() {
  const { data: session, update } = useSession();
  const [stats, setStats] = React.useState("");
  const [edited, setEdited] = React.useState("");
  const [country, setCountry] = React.useState(null);
  const [editIndex, setEditIndex] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const countries = ["United States", "Germany", "Japan", "Canada"];

  React.useEffect(() => {
    const getStats = async () => {
      try {
        if (!session) return;
        const res = await fetch(`/api/getStats/${session?.user?.id}`);
        const data = await res.json();
        setStats(data.stats);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [session]);

  const handleSubmit = async (field) => {
    const updateField = async (field) => {
      try {
        const res = await fetch(`/api/updateInfos/profile`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ field: field, value: edited }),
        });
        const data = await res.json();
        console.log(data);
        setEditIndex([false, false, false, false, false]);

        if (field === "username") {
          console.log("Updating username to:", edited);
          await update({
            ...session,
            user: {
              ...session.user,
              name: edited,
            },
          });
          console.log("Session after update:", session);
        }
        setEdited("");
      } catch (err) {
        console.log(err);
      }
    };
    if (field == "bio" || field == "country" || field == "username") {
      updateField(field);
    }
  };

  if (!session || !stats) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-1/4 aspect-square border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className=" p-8 w-full min-h-screen pt-20"
      style={{
        background: "linear-gradient(145deg, #1e2b3a 0%, #2a3f54 100%)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      }}
    >
      <div className="px-4 sm:px-0 mb-8">
        <h3 className="text-2xl font-bold" style={{ color: "#7fcac9" }}>
          User Profile
        </h3>
        <p
          className="mt-2 text-sm opacity-80"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Personal details and account information
        </p>
      </div>

      <div
        className="mt-6 border-t"
        style={{ borderColor: "rgba(127,202,201,0.1)" }}
      >
        <dl className="" style={{ borderColor: "rgba(127,202,201,0.1)" }}>
          {[
            { label: "Username", value: session?.user?.name },

            { label: "Email address", value: session?.user?.email },
            { label: "Country", value: stats?.country },

            { label: "Learning Streak", value: `${stats?.dailyStreak} days` },
          ].map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 hover:bg-white/5 transition-colors rounded-lg"
            >
              <dt
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {item.label}
              </dt>
              <dd
                className="mt-1 text-sm sm:col-span-2 sm:mt-0"
                style={{ color: "#7fcac9" }}
              >
                {editIndex[idx] ? (
                  idx === 2 ? (
                    <div className="flex items-center gap-2">
                      <select
                        className="text-black p-2 rounded-lg"
                        onChange={(e) => setEdited(e.target.value)}
                        value={edited}
                      >
                        {countries.map((country, index) => (
                          <option key={index} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSubmit(item.label.toLowerCase())}
                        className="bg-black px-2 rounded-full"
                      >
                        submit
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        onChange={(e) => setEdited(e.target.value)}
                        value={edited}
                        type="text"
                        className="w-full text-black p-2 rounded-lg"
                        placeholder={`Enter ${item.label.toLowerCase()}`}
                      />
                      <button
                        onClick={() => handleSubmit(item.label.toLowerCase())}
                        className="bg-black px-2 rounded-full"
                      >
                        submit
                      </button>
                    </div>
                  )
                ) : (
                  <>
                    {item.value}{" "}
                    {(idx == 0 || idx == 2) && (
                      <EditIcon
                        onClick={() =>
                          setEditIndex((prev) => prev.map((_, i) => i === idx))
                        }
                        className="cursor-pointer ml-5"
                      />
                    )}
                  </>
                )}
              </dd>
            </div>
          ))}

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt
              className="text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Bio
            </dt>
            <dd
              className="mt-1 text-sm sm:col-span-2 sm:mt-0"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <div className="space-y-4">
                <p>
                  {editIndex[4] ? (
                    <>
                      <textarea
                        className="w-full h-20 text-black p-2 rounded-lg"
                        placeholder="Write a short bio about yourself"
                        onChange={(e) => setEdited(e.target.value)}
                        value={edited}
                      ></textarea>
                      <button
                        onClick={() => handleSubmit("bio")}
                        className="bg-black px-2 rounded-full"
                      >
                        submit
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                  {stats?.bio == null && editIndex[4] == false ? (
                    <button
                      className="bg-black px-2 rounded-full"
                      onClick={() =>
                        setEditIndex((prev) => prev.map((_, i) => i === 4))
                      }
                    >
                      add bio
                    </button>
                  ) : (
                    <>
                      {stats?.bio}
                      <EditIcon
                        onClick={() =>
                          setEditIndex((prev) => prev.map((_, i) => i === 4))
                        }
                        className="cursor-pointer ml-5"
                      />
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <PaperClipIcon
                    className="h-5 w-5 flex-none"
                    style={{ color: "#7fcac9" }}
                  />
                  <span style={{ color: "#7fcac9" }}>
                    lang_learner_achievements.pdf
                  </span>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-24 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "daily Streak", value: stats?.dailyStreak, unit: "days" },
          {
            label: "total Terms Learned",
            value: stats?.totalTermsLearned,
            unit: "words",
          },
          { label: "accuracy", value: stats?.accuracy, unit: "%" },
          { label: "xp", value: stats?.xp, unit: "points" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg text-center"
            style={{
              background: "rgba(127,202,201,0.1)",
              border: "1px solid rgba(127,202,201,0.2)",
            }}
          >
            <div style={{ color: "#7fcac9" }} className="text-2xl font-bold">
              {stat.value} {stat.unit}
            </div>
            <div
              style={{ color: "rgba(255,255,255,0.7)" }}
              className="text-sm mt-1"
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
