#
# Cookbook Name:: crisis
# Recipe:: default
#
# Copyright (C) 2013 John Manero
# 
# All rights reserved - Do Not Redistribute
#

include_recipe "apt"
apt_repository "node.js" do
  uri "http://ppa.launchpad.net/chris-lea/node.js/ubuntu"
  distribution node["lsb"]["codename"]
  components ["main"]
  keyserver "keyserver.ubuntu.com"
  key "C7917B12"
end
apt_repository "mongodb" do
  uri "http://downloads-distro.mongodb.org/repo/ubuntu-upstart"
  distribution "dist"
  components ["10gen"]
  keyserver "keyserver.ubuntu.com"
  key "7F0CEB10"
end

## Packages
package "curl"
package "build-essential"
package "nodejs"
package "mongodb"
