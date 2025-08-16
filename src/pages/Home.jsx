import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Reclaim-It 🔍 <br /> 
          <span className="text-blue-600">Smart Lost & Found Platform</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A simple way to report, find, and reclaim lost items.  
          Connect people faster and smarter with cloud-powered tracking.
        </p>

        <div className="flex gap-4 justify-center">
          <Button className="px-6 py-3 text-lg rounded-2xl shadow-md hover:shadow-lg transition">
            Report Lost
          </Button>
          <Button variant="outline" className="px-6 py-3 text-lg rounded-2xl">
            Report Found
          </Button>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-6xl">
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">🔎 Easy Search</h3>
            <p className="text-gray-600">
              Quickly search for lost or found items with smart filters.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">☁️ Cloud Synced</h3>
            <p className="text-gray-600">
              All reports are securely stored and synced on the cloud.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">🤝 Community Support</h3>
            <p className="text-gray-600">
              Connect with people nearby who might have found your items.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="mt-16 text-gray-500 text-sm">
        Made with ❤️ by Reclaim-It Team
      </div>
    </div>
  );
};

export default Home;
