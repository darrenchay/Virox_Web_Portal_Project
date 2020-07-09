CREATE TABLE EXPERIMENT_RECORDS ( 
	record_id            SERIAL NOT NULL  PRIMARY KEY  ,
	LOT_NO               integer NOT NULL DEFAULT 11111   ,
	formulation_date     date NOT NULL DEFAULT '1/1/11'   ,
	preparation_date     date NOT NULL DEFAULT '1/1/11'   ,
	project_title        varchar(256) NOT NULL DEFAULT ''   ,
	prepared_by          varchar(256) NOT NULL DEFAULT ''   ,
	quantity             double precision NOT NULL DEFAULT 0   ,
	notes                varchar(600)     ,
	preparation_reason   varchar(600)     ,
	observations         varchar(600)     ,
	obs_description      varchar(256)     ,
	rating               varchar(256)     ,
	total_percentage_w   double precision NOT NULL DEFAULT 0   ,
	total_AR             double precision NOT NULL DEFAULT 0   ,
	total_AD             double precision NOT NULL DEFAULT 0   ,
	date_created         timestamp NOT NULL DEFAULT '1/1/11'   ,
	date_updated         timestamp  DEFAULT '1/1/11'   
 );

CREATE TABLE HYDROGEN_PEROXIDE_DATA ( 
	hp_id                SERIAL NOT NULL PRIMARY KEY  ,
	experiment_record_id integer NOT NULL    ,
	hp_type              integer NOT NULL DEFAULT -1   ,
	experiment_name      varchar(256) NOT NULL DEFAULT ''   ,
	N                    double precision NOT NULL  ,
	M                    double precision   ,
	vol_change           double precision    ,
	H2O2                 double precision NOT NULL   ,
	PH                   double precision     ,
	accepted_range       varchar(50)     ,
	date                 date     ,
	initials             varchar(50)     ,
	conditions           varchar(256)     ,
	SG                   varchar(256)     ,
	date_created         timestamp NOT NULL DEFAULT '1/1/11'   ,
	date_updated         timestamp  DEFAULT '1/1/11'   ,
	FOREIGN KEY ( experiment_record_id ) REFERENCES experiment_records( record_id )  
 );

CREATE TABLE RAW_MATERIALS ( 
	raw_material_id      SERIAL NOT NULL  PRIMARY KEY  ,
	experiment_record_id integer NOT NULL    ,
	raw_material_name    varchar(256) NOT NULL DEFAULT '-'   ,
	percentage_w         double precision NOT NULL DEFAULT 0   ,
	raw_material_lot     varchar(50)     ,
	AR                   double precision NOT NULL DEFAULT 0   ,
	AD                   double precision NOT NULL DEFAULT 0   ,
	notes                varchar(600)     ,
	time_added           timestamp     ,
	date_created         timestamp NOT NULL DEFAULT '1/1/11'   ,
	date_updated         timestamp  DEFAULT '1/1/11',   
	FOREIGN KEY ( experiment_record_id ) REFERENCES EXPERIMENT_RECORDS( record_id )  
 );
