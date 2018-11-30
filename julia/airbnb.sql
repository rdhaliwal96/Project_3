DROP DATABASE IF EXISTS project_3;
CREATE DATABASE project_3;

USE project_3;

SELECT * FROM listings_data;

ALTER TABLE listings_data DROP neighborhood_overview, DROP notes, DROP transit, DROP access, DROP interaction, 
DROP house_rules, DROP thumbnail_url, DROP medium_url, DROP picture_url, DROP xl_picture_url, DROP host_id, 
DROP host_url, DROP host_name, DROP host_about, DROP host_thumbnail_url, DROP host_picture_url, DROP host_verifications, 
DROP host_has_profile_pic, DROP host_identity_verified, DROP neighbourhood_group_cleansed, DROP city, DROP state, 
DROP smart_location, DROP country_code, DROP country, DROP is_location_exact, DROP square_feet, DROP calendar_last_scraped, 
DROP license, DROP jurisdiction_names, DROP instant_bookable, DROP is_business_travel_ready, DROP cancellation_policy, 
DROP require_guest_profile_picture, DROP require_guest_phone_verification;


ALTER TABLE listings_data DROP scrape_id;
-- ALTER TABLE listings_data DROP last_scraped;

ALTER TABLE listings_data DROP experiences_offered, DROP street, DROP neighbourhood, DROP market, DROP summary, 
DROP space, DROP description, DROP host_location, DROP host_acceptance_rate, DROP neighbourhood_cleansed, DROP amenities;

ALTER TABLE listings_data DROP host_since, DROP host_response_time, DROP host_response_rate, DROP host_is_superhost, 
DROP host_listings_count, DROP host_total_listings_count, DROP requires_license, DROP calculated_host_listings_count, 
DROP reviews_per_month;


SELECT * FROM listings_data;