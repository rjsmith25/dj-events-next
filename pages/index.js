import axios from "axios";
import { API_URL } from "@/config/index";
import EventItem from "@/components/EventItem";
import Link from "next/link";

export default function Home({ events }) {
  return (
    <>
      <h1>Upcoming Events</h1>
      {events.map((evt) => {
        return <EventItem key={evt.id} evt={evt} />;
      })}
      {events.length > 0 && (
        <Link href="/events">
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(`${API_URL}/events?_sort=date:ASC&_limit=3`);

  return {
    props: {
      events: res.data,
    },
  };
}
