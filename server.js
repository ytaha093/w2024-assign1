const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supabase = supa.createClient(process.env.URL, process.env.KEY);

// add my url and key to the repo
// add error msg if does not exist
// compare results with kyle (kyle compared with mo)

/*
 * return all seasons
 */
app.get("/api/seasons", async (req, res) => {
    try {
        const { data, error } = await supabase.from("seasons").select()
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return all circuits
 */
app.get("/api/circuits", async (req, res) => {
    try {
        const { data, error } = await supabase.from("circuits").select()
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return a circuit by circuitRef
 * @ref: circuit name
 */
app.get("/api/circuits/:ref", async (req, res) => {
    try {
        const { data, error } = await supabase.from("circuits").select().eq("circuitRef", req.params.ref)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return a the circuits used in a given season
  * @year: circuit season year
 */
app.get("/api/circuits/season/:year", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("races")
            .select("circuits(*)")
            .eq("year", req.params.year)
            .order("round", { ascending: true })
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return all constructors
 */
app.get("/api/constructors", async (req, res) => {
    try {
        const { data, error } = await supabase.from("constructors").select()
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return a constructors by constructorRef
 * @ref: constructors ref name
 */
app.get("/api/constructors/:ref", async (req, res) => {
    try {
        const { data, error } = await supabase.from("constructors").select().eq("constructorRef", req.params.ref)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return all drivers
 */
app.get("/api/drivers", async (req, res) => {
    try {
        const { data, error } = await supabase.from("drivers").select()
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return a drivers by driverRef
 * @ref: drivers ref name
 */
app.get("/api/drivers/:ref", async (req, res) => {
    try {
        const { data, error } = await supabase.from("drivers").select().eq("driverRef", req.params.ref)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return drivers whose surname begins with the provided substring
 * @substring: substring to search for
 */
app.get("/api/drivers/search/:substring", async (req, res) => {
    try {
        const { data, error } = await supabase.from("drivers").select().ilike("surname", req.params.substring + "%")
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return a drivers withen a given race
 * @id: race id of the race
 */
app.get("/api/drivers/race/:raceId", async (req, res) => {
    try {
        const { data, error } = await supabase.from("qualifying").select("drivers(*)").eq("raceId", req.params.raceId)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * return a specific race along with info about the circuit
 * @raceId: id of the race
 */
app.get("/api/races/:raceId", async (req, res) => {
    try {
        const { data, error } = await supabase.from("races")
            .select("raceId, year, round, name, date, time, url, fp1_date, fp1_time, fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time, circuits(name, location, country)")
            .eq("raceId", req.params.raceId)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns the races within a given season ordered by round
 * @year: season year
 */
app.get("/api/races/season/:year", async (req, res) => {
    try {
        const { data, error } = await supabase.from("races").select().eq("year", req.params.year).order("round", { ascending: true })
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns a specific race based off round and year
 * @year: season year
 * @round round number
 */
app.get("/api/races/season/:year/:round", async (req, res) => {
    try {
        const { data, error } = await supabase.from("races")
            .select().eq("year", req.params.year).eq("round", req.params.round)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns all the races for a given circuits circuitRef feild
 * @ref: circuits circuitRef feild to get races by
 */
app.get("/api/races/circuits/:ref", async (req, res) => {
    try {
        const { data, error } = await supabase.from("races")
            .select("*, circuits!inner()")
            .eq("circuits.circuitRef", req.params.ref)
            .order("year")
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns all the races for a given circuit between two years
 * @ref: circuits circuitRef feild to get races by
 */
app.get("/api/races/circuits/:ref/season/:start/:end", async (req, res) => {
    try {
        const { data, error } = await supabase.from("races")
            .select("*, circuits!inner()")
            .eq("circuits.circuitRef", req.params.ref)
            .lte("year", req.params.end)
            .gte("year", req.params.start)
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns the results for the specified race
 * @raceId: id of the race
 */
app.get("/api/results/:raceId", async (req, res) => {
    try {
        const { data, error } = await supabase.from("results")
            .select("resultId, number, grid, position, positionText, positionOrder, points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId,drivers (driverRef, code, forename, surname),races (name, round, year, date), constructors (name, constructorRef, nationality)")
            .eq("raceId", req.params.raceId)
            .order("grid", { ascending: true });
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns all the results for a given driver
 * @ref: driverref to get results for
 */
app.get("/api/results/driver/:ref", async (req, res) => {
    try {
        const { data, error } = await supabase.from("results")
            .select("*, drivers!inner()")
            .eq("drivers.driverRef", req.params.ref)
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns Returns all the results for a given driver between two years
 * @ref: driverRef of driver to ger results for
 * @start: start year
 * @end: end year
 */
app.get("/api/results/driver/:ref/seasons/:start/:end", async (req, res) => {
    try {
        const { data, error } = await supabase.from("results")
            .select("*, drivers!inner(), races!inner()")
            .eq("drivers.driverRef", req.params.ref)
            .lte("races.year", req.params.end)
            .gte("races.year", req.params.start)
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns the qualifying results for the specified race
 * @raceId: id of the race
 */
app.get("/api/qualifying/:raceId", async (req, res) => {
    try {
        const { data, error } = await supabase.from("qualifying")
            .select("qualifyId, number, position, q1, q2, q3, races(*), drivers(*), constructors(*)")
            .eq("raceId", req.params.raceId)
            .order("position", { ascending: true });
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns the current season driver standings for a specified race
 * @raceId: id of the race
 */
app.get("/api/standings/:raceId/drivers", async (req, res) => {
    try {
        const { data, error } = await supabase.from("driver_standings")
            .select("driverStandingsId, raceId, points, position, positionText, wins ,drivers(*)")
            .eq("raceId", req.params.raceId)
            .order("position", { ascending: true });
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})
/*
 * Returns the current season driver standings for a specified race
 * @raceId: id of the race
 */
app.get("/api/standings/:raceId/constructors", async (req, res) => {
    try {
        const { data, error } = await supabase.from("constructor_standings")
            .select("constructorStandingsId, raceId, points, position, positionText, wins ,constructors(*)")
            .eq("raceId", req.params.raceId)
            .order("position", { ascending: true });
        if (error) res.send(error)
        res.send(data)
    } catch (error) {
        return res.json({ error: error.message });
    }
})


// Run the server and report out to the logs
app.listen(
    { port: process.env.PORT, host: "0.0.0.0" },
    function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Your app is listening on ${address}`);
    }
);
