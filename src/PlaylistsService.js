const {Pool} = require("pg");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getSongsFromPlaylistById(id) {
        const query1 = {
            text: `SELECT p.id, p.name FROM playlists AS p 
                 INNER JOIN users AS u ON p.owner = u.id
                 WHERE p.id = $1`,
            values: [id],
        };

        const query2 = {
            text: `SELECT s.id, s.title, s.performer FROM playlist_songs AS ps 
                 INNER JOIN songs AS s ON s.id = ps.song_id
                 WHERE ps.playlist_id = $1`,
            values: [id],
        };

        const result1 = await this._pool.query(query1);
        const result2 = await this._pool.query(query2);

        const playlist = result1.rows;
        const songs = result2.rows;

        if (!playlist) {
            return {playlist: null}
        }

        const objPlaylist = playlist[0];
        objPlaylist.songs = songs;

        return {playlist: objPlaylist};
    }

}

module.exports = PlaylistsService;