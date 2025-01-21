<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'iCDcA#-*v>J?ek+WP!&3$ox(;+>Ox[G<GQ5r-P;(cd15>KF.Xp aha]nWw(QxL[9' );
define( 'SECURE_AUTH_KEY',  'N]-0m+fdTci6nV#n{%SHHzSe_eqd{xCEnyV)aDDO+<>JoFtbiB#[&}!,tT|M#JO=' );
define( 'LOGGED_IN_KEY',    ' QXlu}+]8_|{XPO&(1kMs/|-J*kZP1Ill6P^?0}hCtfpspdy&9&V&f!|1ED +%Uv' );
define( 'NONCE_KEY',        'Xs=obBDKx}ire2xK$[fRnM.T+URYO]+4.ccm}FQta+&LihF,Pd?&0~E[C?yK/@S/' );
define( 'AUTH_SALT',        '1[i$:XS!E_2)BKn_R|/qYj)0aVwMqUJB#5EBNdSE;<=xr#,t]HE=8y9Svm!g:i(]' );
define( 'SECURE_AUTH_SALT', '&Yi9Ff0Q41A1`XI8 PgT~b2[;+^!]13dh;eEa3.a*G_K)5CK .+Dze4uv|nAeF+p' );
define( 'LOGGED_IN_SALT',   ',<9$,p%BkfXfstc`B?s_1[=De(a`z~o;h[8.6;Y+O51CljxxBe:>t@f+))umej$J' );
define( 'NONCE_SALT',       'i];p!h2Zhh^9jM+HJ+aCW~)tuckRwmszJ[%9)6>2SrVI)8!M1,qf=rKMA5wlNYa;' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
