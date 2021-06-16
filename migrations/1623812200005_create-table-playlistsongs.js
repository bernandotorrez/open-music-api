exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    song_id: {
      type: 'varchar(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
