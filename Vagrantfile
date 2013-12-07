# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.hostname = "crisis-01"
  config.vm.box = "ubuntu-12.04-opscode-provisionerless"
  config.vm.box_url = "https://opscode-vm-bento.s3.amazonaws.com/vagrant/opscode_ubuntu-12.04_provisionerless.box"

  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--memory", 1024]
    vb.customize ["modifyvm", :id, "--cpus", 4]
  end

  config.vm.synced_folder "./files/default/service", "/srv/crisis"
  config.vm.synced_folder "./files/default/ui", "/srv/crisis-ui"
  config.vm.synced_folder "./files/default/tools", "/srv/crisis-tools"

  config.omnibus.chef_version = '11.6.2'
  config.berkshelf.enabled = true
  config.berkshelf.berksfile_path = "./Berksfile"

  config.vm.provision :chef_solo do |chef|
    chef.run_list = [
      "recipe[crisis::default]"
    ]
    chef.log_level = :debug
  end
end
