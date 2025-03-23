import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";

function ProfilePage() {
  const { isSignedIn, user } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const images = [img1, img2, img3, img4, img5, img6];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("https://hackathon-club-backend-production.up.railway.app/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data = await response.json();

        const profilesWithImages = data.map((profile) => ({
          ...profile,
          profilePhoto: images[Math.floor(Math.random() * images.length)],
        }));

        setProfiles(profilesWithImages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProfiles = profiles.filter((profile) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      profile.name.toLowerCase().includes(lowerCaseQuery) ||
      profile.skills.some((skill) =>
        skill.label.toLowerCase().includes(lowerCaseQuery)
      )
    );
  });

  const handleConnect = (email) => {
    const subject = "Let's Connect!";
    const body = "Hi, I came across your profile and would like to connect with you.";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  const handleReadMore = (profile) => {
    setSelectedProfile(profile);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white p-8">
        <h1 className="text-4xl mb-8 font-bold">
          Connect with Talents
        </h1>
        <div className="mb-6">
          <Skeleton height={48} className="w-full breathing rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-stone-950 rounded-lg p-6 shadow-lg flex flex-col"
            >
              <div className="flex gap-6 mb-6">
                <div className="flex-shrink-0">
                  <Skeleton className="breathing" circle={true} height={128} width={128} />
                </div>
                <div className="flex-1">
                  <Skeleton  height={28} width="70%" className="mb-2" breathing />
                  <Skeleton height={16} width="40%" className="mb-4 text-stone-400 breathing" />
                  <Skeleton   height={20} width="90%" className="mb-4 breathing" />
                  <Skeleton  height={20} width="30%" className="mb-2 breathing" />
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} height={16} width="60%" className="mb-2 breathing" />
                  ))}
                </div>
              </div>
              <Skeleton  height={40} className="breathing rounded-full mt-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white font-inter p-8">
        <h2 className="text-4xl font-bold mb-6 text-center">Please Log In First</h2>
        <p className="text-stone-400 text-center mb-4">You need to be signed in to view profiles.</p>
        <button
          onClick={() => navigate("/sign-in")}
          className="bg-gradient-to-r from-red-700 to-red-500 py-2 px-4 rounded-lg text-white font-semibold"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-4xl mb-8 font-bold animate__animated animate__fadeIn">
        Connect with Talents
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
        />
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredProfiles.map((profile, index) => (
          <motion.div
            key={profile._id}
            className="bg-stone-950 rounded-lg p-6 shadow-lg cursor-pointer transform hover:scale-105 hover:bg-gradient-to-br from-red-700 to-red-500 flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex gap-6 mb-6">
              <div className="flex-shrink-0">
                <img
                  src={profile.profilePhoto || "fallback-image.jpg"}
                  alt={profile.name}
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{profile.name}</h2>
                <p className="text-sm text-stone-400 mb-4">{profile.college}</p>
                <p className="text-lg mb-4">{profile.interests}</p>
                <h3 className="text-lg font-medium">Skills:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {profile.skills.slice(0, 3).map((skill, idx) => (
                    <li key={idx}>
                      <strong>{skill.label}:</strong> {skill.value}
                    </li>
                  ))}
                </ul>
                {profile.skills.length > 3 && (
                  <button
                    onClick={() => handleReadMore(profile)}
                    className="text-red-500 mt-2 block"
                  >
                    Read More...
                  </button>
                  )}
              </div>
            </div>
            <div className="mt-auto">
              <button
                onClick={() => handleConnect(profile.email)}
                className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white rounded-full py-3 px-4 transition-transform transform hover:scale-105"
              >
                Connect
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-stone-900 p-6 rounded-lg w-80 md:w-96">
            <h2 className="text-2xl font-semibold mb-4">{selectedProfile.name}</h2>
            <h3 className="text-lg font-medium">Skills:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {selectedProfile.skills.map((skill, idx) => (
                <li key={idx}>
                  <strong>{skill.label}:</strong> {skill.value}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white rounded-full py-3 px-4 transition-transform transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;