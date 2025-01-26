"use client";

import React from "react";
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { useSession } from "next-auth/react";
//update the other parts later (the ones besides stats)
export default function Profile() {
  const { data: session } = useSession();
  const [stats, setStats] = React.useState(null);
  React.useEffect(() => {
    const getStats = async ()=>{

      try{
        if(!session) return;
        const res = await fetch(`/api/getStats/${session?.user?.id}`);
        const data = await res.json();
        setStats(data.stats);
        console.log(data);
      }catch(err){
        console.log(err);
      }
    }
    getStats();
  }, [session]);

  if (!session) {
    return <div className="text-gray-300">Loading...</div>;
  }

  return (
    <div 
      className=" p-8 w-full h-screen pt-20"
      style={{
        background: 'linear-gradient(145deg, #1e2b3a 0%, #2a3f54 100%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
      }}
    >
      <div className="px-4 sm:px-0 mb-8">
        <h3 
          className="text-2xl font-bold"
          style={{ color: '#7fcac9' }}
        >
          User Profile
        </h3>
        <p 
          className="mt-2 text-sm opacity-80"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Personal details and account information
        </p>
      </div>
      
      <div 
        className="mt-6 border-t"
        style={{ borderColor: 'rgba(127,202,201,0.1)' }}
      >
        <dl className="" style={{ borderColor: 'rgba(127,202,201,0.1)' }}>
          {[
            { label: 'Full name', value: session.user?.name },
            { label: 'Username', value: 'LangLearner123' },
            { label: 'Email address', value: session.user?.email },
            { label: 'Learning Streak', value: '14 days' },
            { label: 'Total Cards Mastered', value: '237' },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 hover:bg-white/5 transition-colors rounded-lg"
            >
              <dt 
                className="text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {item.label}
              </dt>
              <dd 
                className="mt-1 text-sm sm:col-span-2 sm:mt-0"
                style={{ color: '#7fcac9' }}
              >
                {item.value}
              </dd>
            </div>
          ))}

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt 
              className="text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Bio
            </dt>
            <dd 
              className="mt-1 text-sm sm:col-span-2 sm:mt-0"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <div className="space-y-4">
                <p>
                  Passionate language learner currently mastering Spanish and dabbling in Japanese. 
                  Created 15 custom card sets with over 500 words. Daily streak maintained for 2 weeks!
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <PaperClipIcon 
                    className="h-5 w-5 flex-none"
                    style={{ color: '#7fcac9' }}
                  />
                  <span style={{ color: '#7fcac9' }}>
                    lang_learner_achievements.pdf
                  </span>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'daily Streak', value: stats?.dailyStreak, unit: 'days' },
          { label: 'total Terms Learned', value: stats?.totalTermsLearned, unit: 'cards' },
          { label: 'accuracy', value: stats?.accuracy, unit: '%' },
          { label: 'xp', value: stats?.xp, unit: 'xp' },
        ].map((stat, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-lg text-center"
            style={{
              background: 'rgba(127,202,201,0.1)',
              border: '1px solid rgba(127,202,201,0.2)'
            }}
          >
            <div style={{ color: '#7fcac9' }} className="text-2xl font-bold">
              {stat.value}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}