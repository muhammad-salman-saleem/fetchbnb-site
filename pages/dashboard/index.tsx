import React, { useState, useContext } from 'react'
import LayoutDashboard from '../../components/LayoutDashboard';
import NavbarAuthed from '../../components/NavbarAuthed';
import styles from '../../styles/Dashboard.module.css';
import SearchBar from '../../components/SearchBar';
import FilterDropDowns from '../../components/FilterDropDowns';
import Image from 'next/image';
import DashboardContent from '../../components/DashboardContent';
import MapView from '../../components/MapView';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Filters } from '../../shared/interfaces/Filters.d';
import { FilterContext } from '../../contexts/FiltersContext';
import { ReadOnlyContext } from '../../contexts/ReadOnlyContext';
import { HistoricalOverview } from '../../shared/interfaces/historicalOverview';
import HistoricalGraph from '../../components/HistoricalGraph';



export async function getServerSideProps(context: any) {
  const isDemo = context?.query?.isDemo;
  if (isDemo) {
    return {
      props: {

      },
    }
  }
  const session: any = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions as any
  )
  const user: any = session?.user
  console.log("user from dashboard: ", user)
  console.log(user, 'user from index page')
  if (user === undefined) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  if (user?.plan === "UNPAID" || user?.plan === undefined) {
    return {
      redirect: {
        destination: '/pricing?error=unpaid',
        permanent: false,
      }
    }
  }
  if (user?.plan === "ZONING") {
    return {
      redirect: {
        destination: '/dashboard/zoning',
        permanent: false,
      }
    }
  }
  delete user.emailVerified;
  return {
    props: {
      user: user,
    },
  }
}

type DashboardProps = {
  user: any;
}

enum Plan {
  UNPAID = "UNPAID",
  ZONING = "ZONING",
  RENTAL = "RENTAL",
  BUYING = "BUYING",
  BOTH = "BOTH",
}

const Dashboard = () => {
  const [propertiesUpdated, setPropertiesUpdated] = useState<boolean>(false);
  const [graphAvgs, setGraphAvgs] = useState({ dailyRate: 0, occupancy: 0, revenue: 0 });
  const [isScrolledToBottom, setIsScrolltedToBottom] = useState(false);
  const [avgDailyRateGraph, setAvgDailyRateGraph] = useState<any>([{
    "id": "avgdailyrate",
    "color": "hsl(138, 70%, 50%)",
    "data": [],
  }]);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [occGraph, setOccGraph] = useState<any>([{
    "id": "avgdailyrate",
    "color": "hsl(138, 70%, 50%)",
    "data": [],
  }]);
  const [revGraph, setRevGraph] = useState<any>([{
    "id": "avgdailyrate",
    "color": "hsl(138, 70%, 50%)",
    "data": [],
  }]);
  const [historicalOverview, setHistoricalOverview] = useState<HistoricalOverview[]>([{
    beds: 1,
    occupancy: undefined,
    price: undefined,
    revenue: undefined,
  }]);
  const [readOnly, setReadOnly] = useContext(ReadOnlyContext);
  const handleCustomGeoLoad = (newTitle: string) => {
    setReadOnly({ ...readOnly, propertyTitle: newTitle });
  }

  const [filters, setFilters] = useContext(FilterContext);
  const updateFilters = (newValues: any) => {
    setFilters({ filters: { ...filters.filters, ...newValues } });
    console.log(newValues, "new")
  }
  const months = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  }

  React.useEffect(() => {
    const historicalOverview = readOnly?.historicalOverview as HistoricalOverview[];
    console.log({ readOnly })
    const averages = {
      avgDailyRate: { value: 0, total: 0 },
      avgOcc: { value: 0, total: 0 },
      avgRev: { value: 0, total: 0 },
    }
    for (let i = 0; i < historicalOverview.length; i++) {
      const hist = historicalOverview[i];
      if (hist?.price !== undefined) {
        const vals = hist?.price?.filter((priceObj) => priceObj?.value !== null)?.map((priceObj, index: number) => {
          if (priceObj?.value !== null) {
            averages.avgDailyRate.value += priceObj?.value;
            averages.avgDailyRate.total += 1;
          }
          return {
            // "x": months[priceObj.month as keyof typeof months],
            "x": priceObj?.month,
            "y": priceObj?.value
          }
        })

        //reoder vals based on x
        vals.sort((a, b) => {
          return a.x - b.x;
        })

        // change x from number to month
        vals.forEach((val) => {
          val.x = months[val.x.toString() as keyof typeof months] as any
        })
        if (i === 0) {
          setAvgDailyRateGraph([{
            "id": hist.beds.toString(),
            "color": "hsl(138, 70%, 50%)",
            "data": vals,
          }])
        } else {
          setAvgDailyRateGraph((prev: any) => {
            return [...prev, {
              "id": hist.beds.toString(),
              "color": "hsl(138, 70%, 50%)",
              "data": vals,
            }]
          })
        }
      }
      if (hist?.occupancy !== undefined) {
        const vals = hist?.occupancy?.filter((priceObj) => priceObj?.value !== null)?.map((priceObj, index: number) => {
          if (priceObj?.value !== null) {
            averages.avgOcc.value += priceObj?.value;
            averages.avgOcc.total += 1;
          }
          return {
            // "x": months[priceObj.month as keyof typeof months],
            "x": priceObj?.month,
            "y": priceObj?.value
          }
        })
        //reoder vals based on x
        vals.sort((a, b) => {
          return a.x - b.x;
        })


        // change x from number to month
        vals.forEach((val) => {
          val.x = months[val.x.toString() as keyof typeof months] as any
        })
        if (i === 0) {
          setOccGraph([{
            "id": hist.beds.toString(),
            "color": "hsl(138, 70%, 50%)",
            "data": vals,
          }])
        } else {
          setOccGraph((prev: any) => {
            return [...prev, {
              "id": hist.beds.toString(),
              "color": "hsl(138, 70%, 50%)",
              "data": vals,
            }]
          })
        }
      }
      if (hist?.revenue !== undefined) {
        const vals = hist?.revenue?.filter((priceObj) => priceObj?.value !== null)?.map((priceObj, index: number) => {
          if (priceObj?.value !== null) {
            averages.avgRev.value += priceObj?.value;
            averages.avgRev.total += 1;
          }
          return {
            // "x": months[priceObj.month as keyof typeof months],
            "x": priceObj?.month,
            "y": priceObj?.value
          }
        })
        //reoder vals based on x
        vals.sort((a, b) => {
          return a.x - b.x;
        })


        // change x from number to month
        vals.forEach((val) => {
          val.x = months[val.x.toString() as keyof typeof months] as any
        })
        if (i === 0) {
          setRevGraph([{
            "id": hist.beds.toString(),
            "color": "hsl(138, 70%, 50%)",
            "data": vals,
          }])
        } else {
          setRevGraph((prev: any) => {
            return [...prev, {
              "id": hist.beds.toString(),
              "color": "hsl(138, 70%, 50%)",
              "data": vals,
            }]
          })
        }
      }
    }
    setGraphAvgs({
      dailyRate: averages.avgDailyRate.value / averages.avgDailyRate.total,
      occupancy: averages.avgOcc.value / averages.avgOcc.total,
      revenue: averages.avgRev.value / averages.avgRev.total,
    })

  }, [readOnly])

  function handleScroll(e: any) {
    const { scrollTop, scrollHeight, offsetHeight } = e.target;
    const hasScrollReachedBottom = offsetHeight + scrollTop > scrollHeight - 40;

    if (hasScrollReachedBottom) {
      setIsScrolltedToBottom(true);
    } else {
      setIsScrolltedToBottom(false);
    }
  }


  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <NavbarAuthed />
        <div className={styles.searchcontrol__container}>
          <LayoutDashboard>
            <div className={styles.searchcontrol__flex}>
              <div className={styles.searchcontrol__start}>
                <SearchBar handleCustomGeoLoad={handleCustomGeoLoad} mapToggle={setPropertiesUpdated} isScrolledToBottom={isScrolledToBottom} searchIsLoading={searchIsLoading} setSearchIsLoading={setSearchIsLoading} />
                <span className={styles.searchcontrol__small}>Filters</span>
                <div className={styles.vertical__line}></div>
              </div>
              <FilterDropDowns filters={filters.filters} handleChange={updateFilters} />
              <div className={styles.rankings}>
                <div>
                  <Image src='/imgs/rank1.svg' width='11' height='11' alt='' />
                  <span className={styles.rank__font}>Poor Property</span>
                </div>
                <div>
                  <Image src='/imgs/rank2.svg' width='11' height='11' alt='' />
                  <span className={styles.rank__font}>Medium Property</span>
                </div>
                <div>
                  <Image src='/imgs/rank3.svg' width='11' height='11' alt='' />
                  <span className={styles.rank__font}>Great Property</span>
                </div>
              </div>
            </div>
          </LayoutDashboard>
        </div>
      </div>
      <div className={styles.dashboard__split}>
        <div className={styles.split}>
          <div className={styles.dashboard__content} onScroll={handleScroll}>
            <DashboardContent title={readOnly.propertyTitle} filters={filters.filters} handleChange={updateFilters} searchIsLoading={searchIsLoading} />
          </div>
          <div className={styles.mapview}>
            <div className={styles.historical__parent}>
              <div className={styles.historical__container}>
                <div className={styles.historical__item}>
                  <span className={styles.historical__title}>Avg. Daily Rate</span>
                  <span className={styles.historical__subtitle}>${Math.round(graphAvgs.dailyRate)}</span>
                  <HistoricalGraph color={["#FBCA4C", "#FBCA4C", "#FBCA4C"]} data={avgDailyRateGraph} />
                </div>
                <div className={styles.historical__item}>
                  <span className={styles.historical__title}>Occupancy Rate</span>
                  <span className={styles.historical__subtitle}>{Math.round(graphAvgs.occupancy)}%</span>
                  <HistoricalGraph color={["#5B72E7", "#5B72E7", "#5B72E7"]} data={occGraph} />
                </div>
                <div className={styles.historical__item}>
                  <span className={styles.historical__title}>Revenue</span>
                  <span className={styles.historical__subtitle}>${Math.round(graphAvgs.revenue)}</span>
                  <HistoricalGraph color={["#5DC16A", "#5DC16A", "#5DC16A"]} data={revGraph} />
                </div>
              </div>
            </div>
            <MapView propertiesUpdated={propertiesUpdated} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;