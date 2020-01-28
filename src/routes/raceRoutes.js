import { createRace, listRaces, getRace, updateRace, deleteRace } from "../controllers/raceController.js";

export const raceRoutes = (app) => {
    app.route('/race/create')
        .post(createRace);

    app.route('/race/:id')
        .get(getRace);

    app.route('/race/:id')
        .put(updateRace);

    app.route('/race/:id')
        .delete(deleteRace);
}