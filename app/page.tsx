'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

const TOPICS = [
  "Ingredients",
  "Specials"
];

export default function Home() {
  const [topic, setTopic] = useState(TOPICS[0]);

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
  }

  const getIngredients = async () => {
    try {
      const response = await fetch("/api/getIngredients");
      if (!response.ok) {
        console.error("Failed to fetch ingredients");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

    if(topic === TOPICS[0]) {
      getIngredients();
    }

  }, [topic])


  const content = () => {
    switch (topic) {
      case TOPICS[0]:
        return <div>Ingredients Content</div>;
      case TOPICS[1]:
        return <div>Specials Content</div>;
      default:
        return null;
    }
  }


  return (
    <div className="flex px-20 w-full min-h-screen flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4 w-[200px] min-h-screen max-w-sm p-8 bg-white dark:bg-zinc-900 shadow border-r-1 border-neutral-600">
        <div className={'cursor-pointer hover:bg-zinc-700 p-4 rounded-lg'}  onClick={() => handleTopicChange(TOPICS[0])} >Ingredients</div>
        <div className={'cursor-pointer hover:bg-zinc-700 p-4 rounded-lg'}  onClick={() => handleTopicChange(TOPICS[1])} >Specials</div>
      </div>
      <div className="flex flex-col gap-4 w-full min-h-screen p-8 bg-white dark:bg-zinc-900 shadow">
        {content()}
      </div>
    </div>
  );
}
